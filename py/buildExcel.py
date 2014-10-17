#-*- coding: utf-8 -*-
# 오류처리 및 코드를 최대한 최적화 할 것.
import sys
sys.path.append(r'C:\Python27\Lib')
sys.path.append(r'C:\Python27\Lib\site-packages')

import pymongo
from openpyxl import load_workbook


def stdout(a):
    sys.stdout.write(str(a) + "\\n")


def build(filename,document_name,output_path,document_key):

    print " ", filename, "::", document_name,"::", output_path, "::", document_key

    try:
        wb = load_workbook(filename, use_iterators = True)
        ws = wb.active

        #DB 연결에 대한 에러처리 Exception 처리
        collection = db_connection(document_name)

        #각 값이 없을 때 또는 Exception 처리
        result = collection.find_one({"VATKEY":document_key})

        for items in result.keys():
            if items == '_id' or items == '__v':
                continue
            #items 의 값 Validation 처리
            print items, "/", result[items]
            #if ws.has_key(items):
            #ws[items] = result[items]

        ws['TAX_CARD_AMOUNT'] = result['TAX_CARD_AMOUNT']

        opath = output_path+document_key+'.xlsx'
        wb.save(opath)

    except:
        print "Unexpected Error:",sys.exc_info()[0]
        return 1

    return 0


def db_connection(document_name):
    try:
        client = pymongo.MongoClient()
        db = client.test
        collection = db[document_name]

        return collection
    except pymongo.errors.ConnectionFailure, e:
        return 1


# 메인 함수.
if __name__ == "__main__":
    filename = sys.argv[1]
    output_path = sys.argv[2]
    document_name = sys.argv[3]
    document_key = sys.argv[4]
    stdout(build(filename,document_name,output_path,document_key))
    sys.exit(0)
