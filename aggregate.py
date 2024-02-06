import openpyxl
import json

data = {}

def scanExcelNew(year):

    def getCellValue(row, col):
        cell = ws.cell(row, col)
        val = cell.value
        return val
    try:
        wb = openpyxl.load_workbook(f'State_to_State_Migrations_Table_{year}.xlsx')
    except FileNotFoundError as e:
        raise Exception(f"Invalid file name was entered with year: {year}")
    ws = wb['Table']

    cur_row = 12
    cur_col = 10

    currentYear = {}

    for i in range(0,11):
        for j in range(0,5):
            if cur_row == 21: # District of Columbia
                cur_row += 1
                continue
            if cur_row == 44: # Break in table
                cur_row = 48
                break
            if cur_row == 77: # No more data
                break
            
            stateName = getCellValue(cur_row, 1)

            fromStateData = {}

            singleData = {}
            singleData['estimate'] = getCellValue(cur_row, cur_col)
            cur_col += 1
            singleData['MOE'] = getCellValue(cur_row, cur_col)
            cur_col += 2

            fromStateData[getCellValue(7, cur_col - 3)] = singleData # {'State': {'estimate': 'N/A', 'MOE': 'N/A'}

            for k in range(0,10):
                for l in range(0,5):
                    if cur_col == 28: # District of Columbia
                        cur_col += 2
                        continue

                    singleData = {}

                    singleData['estimate'] = getCellValue(cur_row, cur_col)
                    cur_col += 1
                    singleData['MOE'] = getCellValue(cur_row, cur_col)
                    cur_col += 1

                    fromStateData[getCellValue(7, cur_col - 2)] = singleData
                    
                cur_col += 1
            cur_col = 10
            if year == 2010:
                data[stateName] = {}
            data[stateName][year] = fromStateData

            cur_row += 1
        cur_row += 1
    return 

for i in range(2010,2023):
    scanExcelNew(i)

with open ('test.json', 'w') as output:
    json.dump(data, output)