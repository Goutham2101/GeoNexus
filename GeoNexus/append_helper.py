import sys, base64
with open(sys.argv[1], "ab") as f:
    f.write(base64.b64decode(sys.argv[2]))
