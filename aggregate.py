import openpyxl
import json

wb = openpyxl.load_workbook('State_to_State_Migration_Table_2022_T13.xlsx')
ws = wb['Table']

data = {}

cur_row = 12
cur_col = 10

def getCellValue(row, col):
    cell = ws.cell(row, col)
    val = cell.value
    return val

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
        currentYear['2022'] = fromStateData
        data[stateName] = currentYear

        cur_row += 1
    cur_row += 1

print(data)