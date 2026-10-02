"""
Automated CLI Runner for Endless JMeter Performance & Load Tests
Supports native Apache JMeter execution and includes an internal high-throughput fallback runner.
"""
import os
import sys
import time
import shutil
import subprocess
import argparse
import urllib.request
import json

def find_jmeter():
    """Finds JMeter executable in PATH or standard install paths."""
    jmeter_cmd = "jmeter.bat" if sys.platform == "win32" else "jmeter"
    path = shutil.which(jmeter_cmd) or shutil.which("jmeter")
    if path:
        return path

    jmeter_home = os.environ.get("JMETER_HOME")
    if jmeter_home:
        candidate = os.path.join(jmeter_home, "bin", jmeter_cmd)
        if os.path.isfile(candidate):
            return candidate

    return None


def run_jmeter_cli(jmeter_bin, args):
    """Executes Apache JMeter in non-GUI CLI mode and outputs HTML dashboard report."""
    results_dir = os.path.abspath("results")
    if os.path.exists(results_dir):
        shutil.rmtree(results_dir)
    os.makedirs(results_dir, exist_ok=True)

    jtl_file = os.path.join(results_dir, "results.jtl")
    report_dir = os.path.join(results_dir, "html_report")

    cmd = [
        jmeter_bin,
        "-n",
        "-t", "endless_load_test.jmx",
        "-l", jtl_file,
        "-e",
        "-o", report_dir,
        f"-Jhost={args.host}",
        f"-Jport={args.port}",
        f"-Jprotocol={args.protocol}",
        f"-Jthreads={args.threads}",
        f"-Jrampup={args.rampup}",
        f"-Jduration={args.duration}",
    ]

    print("=" * 60)
    print(f"[*] Running Apache JMeter Load Test Plan:")
    print(f"    Target: {args.protocol}://{args.host}:{args.port}")
    print(f"    Concurrency: {args.threads} threads (ramp-up: {args.rampup}s, duration: {args.duration}s)")
    print("=" * 60)
    print(f"Command: {' '.join(cmd)}\n")

    start_time = time.time()
    result = subprocess.run(cmd)
    elapsed = time.time() - start_time

    if result.returncode == 0:
        print("\n" + "=" * 60)
        print(f"[SUCCESS] JMeter Performance Test Finished in {elapsed:.1f}s")
        print(f"[+] JTL Output: {jtl_file}")
        print(f"[+] Interactive HTML Report: {os.path.join(report_dir, 'index.html')}")
        print("=" * 60)
    else:
        print(f"\n[ERROR] JMeter exited with error code {result.returncode}")


def run_builtin_load_runner(args):
    """Fallback high-speed load runner when Java/JMeter is not locally installed."""
    import concurrent.futures

    print("=" * 60)
    print("[*] Built-in Endless Load Runner (Simulating JMeter Thread Group)")
    print(f"    Target: {args.protocol}://{args.host}:{args.port}")
    print(f"    Concurrency: {args.threads} simulated users for {args.duration}s")
    print("=" * 60)

    base_url = f"{args.protocol}://{args.host}:{args.port}"
    latencies = []
    errors = 0
    total_reqs = 0
    stop_time = time.time() + args.duration

    endpoints = [
        "/api/feed?session=jmeter_user_1&cache=on&limit=20",
        "/api/browse?kind=trending&limit=20",
        "/api/browse?kind=category&value=Gaming&limit=20",
        "/api/search?q=Tech",
        "/api/metrics"
    ]

    def worker(worker_id):
        nonlocal total_reqs, errors
        sub_latencies = []
        while time.time() < stop_time:
            ep = endpoints[int(time.time() * 10) % len(endpoints)]
            url = f"{base_url}{ep}"
            t0 = time.time()
            try:
                req = urllib.request.Request(url, headers={"User-Agent": "EndlessLoadTester/1.0"})
                with urllib.request.urlopen(req, timeout=5) as response:
                    t1 = time.time()
                    lat_ms = (t1 - t0) * 1000.0
                    sub_latencies.append(lat_ms)
                    total_reqs += 1
            except Exception:
                errors += 1
            time.sleep(0.1)
        return sub_latencies

    with concurrent.futures.ThreadPoolExecutor(max_workers=min(args.threads, 32)) as executor:
        futures = [executor.submit(worker, i) for i in range(min(args.threads, 32))]
        for f in concurrent.futures.as_completed(futures):
            latencies.extend(f.result())

    if latencies:
        latencies.sort()
        n = len(latencies)
        p50 = latencies[int(n * 0.50)]
        p95 = latencies[int(n * 0.95)]
        p99 = latencies[int(n * 0.99)]
        avg = sum(latencies) / n
        rps = total_reqs / max(args.duration, 1)

        print("\n" + "=" * 60)
        print("[+] Load Test Summary Results:")
        print(f"    Total Requests: {total_reqs}")
        print(f"    Throughput:     {rps:.1f} req/sec")
        print(f"    Average Latency:{avg:.2f} ms")
        print(f"    p50 Latency:    {p50:.2f} ms")
        print(f"    p95 Latency:    {p95:.2f} ms")
        print(f"    p99 Latency:    {p99:.2f} ms")
        print(f"    Error Rate:     {errors}/{total_reqs} ({errors/max(1,total_reqs)*100:.1f}%)")
        print("=" * 60)
    else:
        print("[!] No completed requests recorded (target server may not be reachable).")


def main():
    parser = argparse.ArgumentParser(description="Endless JMeter Performance Test Runner")
    parser.add_argument("--host", default="localhost", help="API Host (default: localhost)")
    parser.add_argument("--port", type=int, default=4000, help="API Port (default: 4000)")
    parser.add_argument("--protocol", default="http", help="Protocol http or https (default: http)")
    parser.add_argument("--threads", type=int, default=30, help="Number of concurrent virtual users (default: 30)")
    parser.add_argument("--rampup", type=int, default=5, help="Ramp-up period in seconds (default: 5)")
    parser.add_argument("--duration", type=int, default=20, help="Test duration in seconds (default: 20)")
    args = parser.parse_args()

    jmeter_bin = find_jmeter()
    if jmeter_bin:
        print(f"[INFO] Found Apache JMeter: {jmeter_bin}")
        run_jmeter_cli(jmeter_bin, args)
    else:
        print("[INFO] Apache JMeter CLI not detected in system PATH. Running built-in load engine.")
        run_builtin_load_runner(args)


if __name__ == "__main__":
    main()
