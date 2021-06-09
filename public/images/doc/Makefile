SOURCES = $(wildcard *.gv)
IMAGES = $(subst .gv,.png, $(SOURCES))

all: $(IMAGES)

%.png: %.gv
	dot -Tpng $< -o $@
