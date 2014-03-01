fin = file("reduced_smallMatrix","r")

jump = False
maxnum = 0.0
for line in fin:
	if not jump:
		jump=True
		continue
	lst = line.strip().split("\t")
	for item in lst:
		if float(item)>maxnum:
			maxnum = float(item)

print maxnum