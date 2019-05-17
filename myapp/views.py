
import math
import mysql.connector
from django.core.serializers import json
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from pymongo import MongoClient
from collections import OrderedDict
import time


def network(request):
    return render(request, "index/network.html", {})


# Create your views here.
def location(request):
    return render(request, "index/location.html", {})


def grade(request):
    return render(request, "index/grade.html", {})


def cluster(request):
    return render(request, "index/cluster.html", {})


@csrf_exempt
def clusterNext(request):
    if request.is_ajax():
        if request.method == 'POST':
            print(request.POST)
            data = request.POST.getlist('request_data')
            tmp = json.loads(data[0])
            for i in tmp:
                print(i)
            # print("tmp", tmp)
            data2 = request.POST.getlist('centeroid')
            tmp2 = json.loads(data2[0])
            step = request.POST['step']

            tmpX = [[], [], []]
            tmpY = [[], [], []]
            for i in range(0, 20):
                tmp3 = []
                for j in range(0, 3):
                    tmp3.append([math.sqrt((float(tmp[i]['age']) - float(tmp2[j]['x'])) ** 2 + (
                                float(tmp[i]['spend']) - float(tmp2[j]['y'])) ** 2), j])
                tmp[i]['class'] = min(tmp3)[1] + 1
                tmpX[min(tmp3)[1]].append(float(tmp[i]['age']))
                tmpY[min(tmp3)[1]].append(float(tmp[i]['spend']))

            # print(avg(tmpX[0]),avg(tmpX[1]),avg(tmpX[2]))
            # print(avg(tmpY[0]), avg(tmpY[1]), avg(tmpY[2]))
            if tmp2[0]['x'] == avg(tmpX[0]) and tmp2[1]['x'] == avg(tmpX[1]) and tmp2[1]['x'] == avg(tmpX[1]) and \
                    tmp2[0]['y'] == avg(tmpY[0]) and tmp2[1]['y'] == avg(tmpY[1]) and tmp2[2]['y'] == avg(tmpY[2]):
                step = '-1';

            else:
                tmp2[0]['x'] = avg(tmpX[0]);
                tmp2[1]['x'] = avg(tmpX[1]);
                tmp2[2]['x'] = avg(tmpX[2]);
                tmp2[0]['y'] = avg(tmpY[0]);
                tmp2[1]['y'] = avg(tmpY[1]);
                tmp2[2]['y'] = avg(tmpY[2]);
                step = int(step) + 1;

        return HttpResponse(json.dumps({'DATA': tmp, 'CEN': tmp2, 'STEP': step}), 'application/json')
    return render(request, 'index/cluster.html')


@csrf_exempt
def kmeans(request):
    if request.is_ajax():
        if request.method == 'POST':
            print(request.POST)
            data = request.POST.getlist('request_data')
            tmp = json.loads(data[0])
            for i in tmp:
                print(i)
            # print("tmp", tmp)
            data2 = request.POST.getlist('centeroid')
            tmp2 = json.loads(data2[0])
            step = request.POST['step']

            while True:
                tmpX = [[], [], []]
                tmpY = [[], [], []]
                for i in range(0, 20):
                    tmp3 = []
                    for j in range(0, 3):
                        tmp3.append([math.sqrt((float(tmp[i]['age']) - float(tmp2[j]['x'])) ** 2 + (
                                float(tmp[i]['spend']) - float(tmp2[j]['y'])) ** 2), j])
                    tmp[i]['class'] = min(tmp3)[1] + 1
                    tmpX[min(tmp3)[1]].append(float(tmp[i]['age']))
                    tmpY[min(tmp3)[1]].append(float(tmp[i]['spend']))

                # print(avg(tmpX[0]),avg(tmpX[1]),avg(tmpX[2]))
                # print(avg(tmpY[0]), avg(tmpY[1]), avg(tmpY[2]))
                if tmp2[0]['x'] == avg(tmpX[0]) and tmp2[1]['x'] == avg(tmpX[1]) and tmp2[1]['x'] == avg(tmpX[1]) and \
                        tmp2[0]['y'] == avg(tmpY[0]) and tmp2[1]['y'] == avg(tmpY[1]) and tmp2[2]['y'] == avg(tmpY[2]):
                    step = '-1';
                    return HttpResponse(json.dumps({'DATA': tmp, 'CEN': tmp2, 'STEP': step}), 'application/json')

                else:
                    tmp2[0]['x'] = avg(tmpX[0]);
                    tmp2[1]['x'] = avg(tmpX[1]);
                    tmp2[2]['x'] = avg(tmpX[2]);
                    tmp2[0]['y'] = avg(tmpY[0]);
                    tmp2[1]['y'] = avg(tmpY[1]);
                    tmp2[2]['y'] = avg(tmpY[2]);
                    step = int(step) + 1;
                    print(tmp)
                    print(tmp2)

        # if step == -1:
        #     return HttpResponse(json.dumps({'DATA':tmp, 'CEN': tmp2, 'STEP' : step}), 'application/json')
    return render(request, 'index/cluster.html')


def avg(a):
    AVG = sum(a, 0.0) / len(a)
    return AVG


def join(request):
    return render(request, "index/join.html")


def recommendation(request):
    return render(request, "index/recommendation.html")


@csrf_exempt
def recommendation_default(request):
    if request.is_ajax():
        mydb = mysql.connector.connect(
            host="localhost",
            user="root",
            passwd="root",
            database="movierating"
        )

        mycursor = mydb.cursor()

        mycursor.execute("SELECT M.title "
                         "From movies M "
                         "ORDER BY rand() desc limit 5")

        myresult = mycursor.fetchall()

        return HttpResponse(json.dumps({'DATA': myresult}), 'application/json')
    return render(request, "index/recommendation.html")


@csrf_exempt
def recommendation_submit(request):
    if request.is_ajax():
        if request.method == 'POST':
            print(request.POST)
            movie = request.POST.getlist('movie[]')
            print(movie)
            rate = request.POST.getlist('rate[]')
            print(rate)

            # mydb = mysql.connector.connect(
            #     host="localhost",
            #     user="root",
            #     passwd="root",
            #     database="movierating"
            # )
            #
            # mycursor = mydb.cursor()
            #
            # sql = "INSERT INTO users (userID, gender, age, occupation) VALUES (%s, %s, %s, %s)"
            # val = []
            #
            # val.append((gender, age, occupation))
            # mycursor.executemany(sql, val)
            # mydb.commit()
            # print(mycursor.rowcount, "record was inserted.")

            return HttpResponse(json.dumps({'DATA': 1}), 'application/json')
    return render(request, "index/recommendation.html")


def ap(request):
    return render(request, "index/apriori.html", {})


@csrf_exempt
def getAprioriData(request):
    minsup = 0.01

    dataSet = getDataset()
    print("====================================== 데이터 불러오기 완료 ======================================")

    print(len(dataSet))

    print("====================================== ap 생성 시작 ======================================")
    t = time.time()
    print(t)
    L, suppData = apriori(dataSet, 0.001)

    rules = generateRules(L, suppData, 0.04)

    print("====================================== ap 생성 완료 ======================================")
    print(time.time(), time.time() - t, "sec")

    # myRules = sorted(rules.ite)
    tmprules = sorted(rules, key=lambda item: (item['sup']))

    # for rule in tmprules:
    #     print(rule)

    supportData = getC1sup(dataSet, 0.001)

    myrules = []

    # for i,val in enumerate(rules):
    #     print(val)

    for i, val in enumerate(rules):
        if len(val["source"]) + len(val["target"]) == 2:
            val["source"] = val["source"][0]
            val["target"] = val["target"][0]
            myrules.append(val)
            # print(val)

    nodes = []
    for i, val in enumerate(myrules):
        node1 = {}
        node1["name"] = val["source"]
        node1["sup"] = supportData[val["source"]]
        if node1 not in nodes:
            nodes.append(node1)

        node2 = {}
        node2["name"] = val["target"]
        node2["sup"] = supportData[val["target"]]
        if node2 not in nodes:
            nodes.append(node2)


    for i in myrules:
        for j, val in enumerate(nodes):
            if i["source"] == val["name"]:
                i["source"] = j
            if i["target"] == val["name"]:
                i["target"] = j

    data = {}
    data["nodes"] = nodes
    data["links"] = myrules

    # itemList = getItemList(dataSet)
    return HttpResponse(json.dumps({'DATA': data, 'itemList': tmprules}), 'application/json')
    return render(request, "index/apriori.html")

def getC1sup(dataSet, minSupport):
    C1 = []
    for transaction in dataSet:
        for item in transaction:
            if not item in C1:
                C1.append(item)

    C1.sort()
    D = dataSet

    # Ck = list(map(frozenset, C1))  # use frozen set so we

    # 나중에 사용하게 될 지지도 값을 가진 딕셔너리 ssCnt
    ssCnt = {}
    for tid in D:
        for can in C1:

            if can in tid:
                if not can in ssCnt:
                    ssCnt[can] = 1
                else:
                    ssCnt[can] += 1

    transLen = float(len(D))
    # 최소 지지도를 만족하는 집합 retList
    retList = []

    supportData = {}
    for key in ssCnt:
        support = ssCnt[key] / transLen
        if support >= minSupport:
            retList.insert(0, key)
        supportData[key] = support
    return supportData


# Fault_Find_Cause1
# csv 파일을 읽어서 Transaction의 형태로 저장
def getDataset():
    client = MongoClient('mongodb://127.0.0.1:27017')

    db = client.test
    collection = db.portal4

    pipeline = list()

    # db.portal4.aggregate([{'$match' : {'date' : '2016-12-25 00:00:00'}},{'$unwind': '$search'},{'$unwind' : '$search.sWord_Spacing'},{'$group': {'_id': '$ip', 'sW' : {'$addToSet' : '$search.sWord_Spacing'}}},{'$project': {'_id' : 1, 'sW': 1}}],{allowDiskUse:true})


    pipeline.append({'$match' : {'date' : '2016-12-09 00:00:00'}})
    pipeline.append({'$unwind': '$search'})
    pipeline.append({'$unwind' : '$search.sWord_Spacing'})
    pipeline.append({'$group': {'_id': '$ip', 'sW' : {'$addToSet' : '$search.sWord_Spacing'}}})
    pipeline.append({'$project': {'_id' : 1, 'sW': 1}})



    result = collection.aggregate(pipeline, allowDiskUse=True)

    transactionData = list()

    for doc in result:
        # print(doc)
        transactionData.append(doc["sW"])

    return transactionData


def getItemList(dataSet):
    itemList = {}
    L = []
    E = []

    I = []
    D = []
    F = []
    S = []
    for transaction in dataSet:
        for item in transaction:

            if item[0] == 'L':
                if not item in L:
                    L.append(item)
            elif item[0] == 'E':
                if not item in E:
                    E.append(item)
            elif item[0] == 'I':
                if not item in I:
                    I.append(item)
            elif item[0] == 'D':
                if not item in D:
                    D.append(item)
            elif item[0] == 'F':
                if not item in F:
                    F.append(item)
            elif item[0] == 'S':
                if not item in S:
                    S.append(item)
    L.sort()
    E.sort()
    S.sort()
    I.sort()
    D.sort()
    F.sort()
    itemList["L"] = L
    itemList["E"] = E
    itemList["I"] = I
    itemList["D"] = D
    itemList["F"] = F
    itemList["S"] = S

    # frozenset은 고정된 집합이므로 변경할 수 없다.
    # set 대신 frozenset을 사용하는 이유는
    # 나중에 이 집합들을 딕셔너리의 키처럼 사용할 것이기 때문이다.
    return itemList


# 후보 아이템 집합 C1을 만드는 함수
# C1을 생성한 다음 단일 아이템이 minSupport를 만족하는지를 확인하기 위해 데이터 집합을 살펴보고
# 요구조건을 만족하는 아이템 집합은 L1이 된다.
# L1을 다시 결합하면 C2가 되고ㅡ 요구조건으로 걸러진 C2는 L2가 된다.
def createC1(dataSet):
    C1 = []
    for transaction in dataSet:
        for item in transaction:
            if not [item] in C1:
                C1.append([item])

    C1.sort()

    # frozenset은 고정된 집합이므로 변경할 수 없다.
    # set 대신 frozenset을 사용하는 이유는
    # 나중에 이 집합들을 딕셔너리의 키처럼 사용할 것이기 때문이다.
    return list(map(frozenset, C1))  # use frozen set so we
    # can use it as a key in a dict


# D는 dataset (transaction list)
# Ck는 후보 집합 리스트
# minSupport는 최소 지지도
# C1으로부터 L1을 생성한다.
def scanD(D, Ck, minSupport):
    # 나중에 사용하게 될 지지도 값을 가진 딕셔너리 ssCnt
    ssCnt = {}
    for tid in D:
        for can in Ck:
            if can.issubset(tid):
                if not can in ssCnt:
                    ssCnt[can] = 1
                else:
                    ssCnt[can] += 1

    transLen = float(len(D))
    # 최소 지지도를 만족하는 집합 retList
    retList = []

    supportData = {}
    for key in ssCnt:
        support = ssCnt[key] / transLen
        if support >= minSupport:
            retList.insert(0, key)
        supportData[key] = support
    return retList, supportData


def aprioriGen(Lk, k):  # creates Ck
    retList = []
    lenLk = len(Lk)
    for i in range(lenLk):
        for j in range(i + 1, lenLk):
            L1 = list(Lk[i])[:k - 2]
            L2 = list(Lk[j])[:k - 2]
            L1.sort()
            L2.sort()

            if L1 == L2:  # if first k-2 elements are equal
                retList.append(Lk[i] | Lk[j])  # set union
    return retList


def apriori(dataSet, minSupport):
    C1 = createC1(dataSet)
    D = list(map(set, dataSet))

    # 길이가 1인 후보 아이템 목록 생성
    L1, supportData = scanD(D, C1, minSupport)
    L = [L1]
    k = 2
    # 집합 내에 있는 아이템의 갯수가 0보다 큰 동안 반복
    # 길이가 2 이상인 후보 아이템 목록 생성
    while (len(L[k - 2]) > 0):
        # 길이가 k인 후보 아이템 집합 Ck 생성
        Ck = aprioriGen(L[k - 2], k)
        # Ck를 이용해 Lk를 생성하고 지지도를 저장하는 딕셔너리 추가
        Lk, supK = scanD(D, Ck, minSupport)  # scan DB to get Lk
        supportData.update(supK)
        L.append(Lk)
        k += 1

    return L, supportData


def generateRules(L, supportData, minConf):  # supportData is a dict coming from scanD
    bigRuleList = []
    for i in range(1, len(L)):  # only get the sets with two or more items
        for freqSet in L[i]:
            # 빈발 아이템 집합을 단일 아이템 집합의 리스트로 만든다 -> H1
            H1 = [frozenset([item]) for item in freqSet]

            for tmp in H1:
                source = freqSet - tmp
                target = tmp

                calcConf(source, target, supportData, bigRuleList, minConf)

    return bigRuleList


def calcConf(source, target, supportData, brl, minConf):
    if (source | target) in supportData.keys() and source in supportData.keys() and target in supportData.keys():
        conftmp = supportData[source | target] / supportData[source]
        if conftmp >= minConf:
            # print(source, '-->', target, 'sup: ', supportData[source | target], ' conf: ', conftmp, ' lift: ',
            #       conftmp / supportData[target])
            tmp = {}
            tmp["source"] = list(source)
            tmp["target"] = list(target)
            tmp["sup"] = supportData[source | target]
            tmp["conf"] = conftmp
            tmp["lift"] = conftmp / supportData[target]
            brl.append(tmp)

