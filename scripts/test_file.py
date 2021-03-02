import sys

print(sys.argv[1])
print('Hello from Python!')
location = sys.argv[1] + "/newfile.txt"
f = open(location, "a")
f.write("Content in the file.")
f.close()
sys.stdout.flush()