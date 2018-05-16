import urllib2
import re
import fileinput
import os
import json
from bs4 import BeautifulSoup

def soupInit(url):
    req = urllib2.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    page = urllib2.urlopen(req).read()
    return BeautifulSoup(page, 'html.parser')

def createFileDelim(filename, iterable, isText, delimeter):
    file = open('%s.txt'%(filename), 'w')
    for i in iterable:
        if isText:
            file.write(i.text.encode('utf-8') + delimeter)
        else:
            file.write(i + delimeter)
    file.close()

def createFile(filename, string):
    if not os.path.exists('../output'):
        os.makedirs('../output')
    file = open(os.path.join('../output','%s.js'%(filename)), 'wb')
    file.write(string)
    file.close()

def openFile(filename):
    file = open('%s.txt'%(filename), "r")
    text = file.read()
    file.close()
    return text

def deleteFile(filename):
    if os.path.exists('%s.txt'%(filename)):
        os.remove('%s.txt'%(filename))
    else:
        print 'file does not exist'

def returnRegexMatchesFromText(text, regExp):
    pattern = re.compile(regExp)
    matches = pattern.findall(text)
    if type(matches) == 'list':
        a = [tuple(j for j in i if j)[-1] for i in a]
        return a
    else:
        return matches

def getStringsWithinBrackets(line):
    bracketCount = 0
    charCount = 0
    newcharcount = 0
    stringInBrackets = ""
    for l in line:
        if l == '(':
            bracketCount += 1
    for l in line:
        charCount += 1
        if l == '(':
            break
    charCount -= 1
    for l in line[charCount:]:
        if bracketCount != 0:
            newcharcount += 1
            stringInBrackets += l
            if l == ')':
                bracketCount -= 1
    print stringInBrackets
    return stringInBrackets

def getProduct(url, productname, file):
    string = ""
    soup = soupInit('%s%s.html'%(url, productname))
    name_box = soup.find_all('li')
    createFileDelim(file, name_box, True, '>>')
    text = openFile(file)
    matches = returnRegexMatchesFromText(text, r'(.*)>>(.*)')
    for match in matches:
        pattern = re.compile(r'(,([\s\S]*?);|,([\s\S]*?)$)')
        find = pattern.findall(match[0])
        if '>>' not in match[0]:
            for f in find:
                name = match[1]
                country = f[0].replace(', ', '')
                pair = getStringsWithinBrackets(name)
            string += "{\n\tname: \"%s\",\n\tcountry: \"%s\",\n\tpair: \"%s\",\n\tingredient: \"%s\"\n},\n"%(name.replace(pair, '').strip(), country, pair, productname)    
    return string  

def getAllProducts(uri, productList, filename):
        string = ""    
        for product in productList:
            string += getProduct(uri, product, filename)
        return string

def main():
    data = "exports.data = ["
    filename = 'drugResults'    
    url = 'https://www.drugs.com/international/'
    products = ['cyclizine', 'amitriptyline', 'paracetamol', 'tramadol', 'sildenafil', 'naproxen']
    data += getAllProducts(url, products, filename)
    data += '];'
    createFile('output', data)
    deleteFile(filename)

main()
# getStringsWithinBrackets("he(y (is(a be) a) and that)'s all")