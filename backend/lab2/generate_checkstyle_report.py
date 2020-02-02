#!/usr/bin/python3

import os
import subprocess
import sys

# This script runs `checkstyle` on java files in the specified location and outputs the result to a report.
# Usage: python3 generate_checkstyle_report.py [path_to_submission_java_files]

CHECKSTYLE_JAR_PATH = "lib/checkstyle-8.24-all.jar"
CHECKSTYLE_XML_PATH = "config/checkstyle/checkstyle.xml"
OUTPUT_FILE = "checkstyle-output.md"

DEFAULT_SOURCE_PATH = "src/ca/mcgill/ecse211/project/"

if len(sys.argv) > 1:
    SOURCE_PATH = sys.argv[1]
else:
    SOURCE_PATH = DEFAULT_SOURCE_PATH

CHECKSTYLE_CMD = f"""
    for f in {SOURCE_PATH}/*.java; do
        java -jar {CHECKSTYLE_JAR_PATH} -c {CHECKSTYLE_XML_PATH} ${{f}}
    done"""

checkstyle_output = []


def run_command(cmd):
    """Run input command in a shell subprocess and capture its output."""
    return subprocess.run(cmd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def remove_old_output_file_if_needed():
    if os.path.exists(OUTPUT_FILE):
        os.remove(OUTPUT_FILE)


def file_loc(f):
    for i, l in enumerate(f):
        pass
    return i + 1


def print_line(f, arr, line):
    try:
        f.write(f"{arr[line]}")
    except Exception:
        print(f"Could not write {arr}[{line}]")
        pass


def print_headers(f):   
    f.write("# Code Style Report\n")


def print_summary(f):
    e = len(checkstyle_output)
    summary = (f"**There {'is' if e == 1 else 'are'} {e if e else 'no'} code style "
               f"issue{'' if e == 1 else 's'} in your submission.**\n\n\n\n")
    print(summary)
    f.write(summary)


def print_warnings(f):
    for v in checkstyle_output:
        v_split = v.split(':')
        with open(f"{SOURCE_PATH}/{v_split[0]}", "r") as g:
            loc = file_loc(g)
            g.seek(0)  # Reset filereader so file can be read again
            src_lines = g.readlines()
            src_lines.insert(0, "")  # Use 1-indexing to make life easier
            #print(src_lines)
            offending_line = int(v_split[1])

            f.write("```java\n")

            if 3 < offending_line < loc - 2:
                for i in range(-3, 3):
                    print_line(f, src_lines, offending_line + i)
            elif offending_line <= 3:
                for i in range(1, 7):
                    print_line(f, src_lines, i)
            else:
                for i in range(loc - 6, loc + 1):
                    print_line(f, src_lines, i)

            f.write("```\n\n")
            f.write(f"{v}\n\n\n___\n\n")


def run_checkstyle():
    global checkstyle_output
    checkstyle = run_command(CHECKSTYLE_CMD)
    for line in checkstyle.stdout.decode().splitlines():
        if "[WARN]" in line:
            checkstyle_output.append(line.split(SOURCE_PATH)[1])


def generate_report():
    remove_old_output_file_if_needed()
    # print(checkstyle_output)
    with open(OUTPUT_FILE, "w") as f:
        print_headers(f)
        print_summary(f)
        print_warnings(f)


def main():
    run_checkstyle()
    generate_report()


if __name__ == "__main__":
    main()
