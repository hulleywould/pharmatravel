import urllib2
import re
import fileinput
import os
import json
import string
import time
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

def createFile(filename, extention, string):
    if not os.path.exists('../output'):
        os.makedirs('../output')
    file = open(os.path.join('../output','%s.%s'%(filename, extention)), 'wb')
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
    return line[line.find('('):line.rfind(')') + 1]

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


def getIngredient(index):
    list_of_ingredients = []    
    soup = soupInit('https://www.medicines.org.uk/emc/browse-ingredients/%s'%(index))
    ingredient_box = soup.find_all(attrs={'class': 'key'})
    for i in ingredient_box:
        list_of_ingredients.append(i)
    return list_of_ingredients


def getAllIngredients():
    ingredients = []
    letters = list(string.ascii_uppercase)
    for l in letters:
        ingredients.append(getIngredient(l))
    ingredients = reduce(lambda x, y: x + y, ingredients)
    createFileDelim('ingredients', ingredients, True, '\n')

def main():
    products = []
    data = "exports.data = ["
    filename = 'drugResults'    
    url = 'https://www.drugs.com/international/'
    f = open('ingredients.txt')
    products = f.readlines()
    f.close()
    data += getAllProducts(url, products, filename)
    data += '];'
    createFile('output', 'js', data)
    deleteFile(filename)

main()

# getAllIngredients()

# getStringsWithinBrackets("he(y (is(a be) a) and that)'s all")