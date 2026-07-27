import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def run(cmd, cwd=ROOT):
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)


def main():
    if len(sys.argv) < 2:
        print("Usage: python scripts/git_review.py <commit-message>")
        sys.exit(1)

    message = sys.argv[1]
    status = run(["git", "status", "--short"])
    diff = run(["git", "diff", "--stat", "HEAD~1", "HEAD"])
    if diff.returncode != 0:
        diff = run(["git", "diff", "--stat"])

    print("\nSuggested commit summary:")
    print(f"- Message: {message}")
    print("- Files changed:")
    for line in diff.stdout.strip().splitlines():
        if line.strip():
            print(f"  {line}")
    print("\nWorking tree status:")
    for line in status.stdout.strip().splitlines():
        if line.strip():
            print(f"  {line}")

    print("\nApprove and push to remote? [y/N]")
    answer = input().strip().lower()
    if answer not in {"y", "yes"}:
        print("Push cancelled.")
        return

    push = run(["git", "push", "origin", "main"])
    if push.returncode != 0:
        print(push.stdout)
        print(push.stderr)
        sys.exit(push.returncode)
    print(push.stdout)
    print(push.stderr)


if __name__ == "__main__":
    main()
