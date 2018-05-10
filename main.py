import urllib2
import re
import fileinput
import os
from bs4 import BeautifulSoup

def createFileDelim(filename, iterable, isText, delimeter):
    file = open(filename, 'w')
    for i in iterable:
        if isText:
            file.write(i.text.encode('utf-8') + delimeter)
        else:
            file.write(i + delimeter)
    file.close()

def openFile(filename):
    file = open(filename, "r")
    text = file.read()
    file.close()
    return text

def deleteFile(filename):
    if os.path.exists(filename):
        os.remove(filename)
    else:
        print 'file does not exist'

def searchAndReplaceInFile(filename, regExp):
    for line in fileinput.input(filename, inplace=True):
        if not re.search(regExp, line):
            print line

def getProduct(url, productfilename):
    req = urllib2.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    page = urllib2.urlopen(req).read()
    soup = BeautifulSoup(page, 'html.parser')
    name_box = soup.find_all('li')
    createFileDelim('list.txt', name_box, True, '>>')
    text = openFile('list.txt')
    pattern = re.compile(r'>>(.*)')
    matches = pattern.findall(text)
    createFileDelim(productfilename, matches, False, '\n')
    searchAndReplaceInFile(productfilename, r'>>')
    deleteFile('list.txt')

getProduct('https://www.drugs.com/international/paracetamol.html', 'paracetamol.txt')
getProduct('https://www.drugs.com/international/cyclizine.html', 'cyclizine.txt')
getProduct('https://www.drugs.com/international/amitriptyline.html', 'amitriptyline.txt')


