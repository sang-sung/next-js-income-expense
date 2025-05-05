import functionService from "@/services/functionService";

type SummaryNode = {
  id: number;
  name: string;
  color: string;
  income?: number;
  expense?: number;
  [key: string]: any; // รองรับ sub1, sub2, sub3, ...
};

export default function TableCate({
  mainCate,
  summary,
}: {
  mainCate: number[][];
  summary: SummaryNode[];
}) {
  return (
    <table className="w-full text-left border-collapse mt-5">
      <thead>
        <tr className="bg-[var(--gray)]">
          {Array.from({ length: mainCate.length }, (_, idx) => (
            <th key={idx} className="border px-4 py-2">
              หมวดหมู่ {idx + 1}
            </th>
          ))}
          <th className="border px-4 py-2">รายรับ</th>
          <th className="border px-4 py-2">รายจ่าย</th>
        </tr>
      </thead>
      {renderRows(summary, mainCate.length)}
    </table>
  );
}

function renderRows(data: SummaryNode[], countLevel: number): any {
  const updatedData = addRowRecursive(data, 0);
  let total = { income: 0, expense: 0 };

  const renderRecursive = (
    node: SummaryNode,
    level: number,
    maxLevel: number
  ): React.ReactNode[][] => {
    const subKey = `sub${level + 1}` as keyof SummaryNode;
    const children = node[subKey] as SummaryNode[] | undefined;

    if (!children || children.length === 0) {
      // กรณี node ไม่มีลูกแล้ว แสดงผลแค่ระดับนี้
      const cells = Array.from({ length: maxLevel }).map((_, i) => {
        if (i === level) {
          return (
            <td
              className="border px-4 py-2"
              key={`cell-${node.id}-${i}`}
              rowSpan={node.row}
            >
              <div className="flex w-full justify-start">
                <p
                  style={{ backgroundColor: node.color }}
                  className={`px-5 py-1 rounded-lg ${
                    functionService.isLightColor(node.color)
                      ? "text-black"
                      : "text-white"
                  }`}
                >
                  {node.name}
                </p>
              </div>
            </td>
          );
        }
        return null;
      });

      // Income/Expense columns (สุดท้าย)
      total.income += node.income ?? 0;
      total.expense += node.expense ?? 0;
      const incomeCell = (
        <td className="border px-4 py-2 text-end" key="income">
          {node.income === 0
            ? ""
            : functionService.formatAmount(Number(node.income))}
        </td>
      );
      const expenseCell = (
        <td className="border px-4 py-2 text-end" key="expense">
          {node.expense === 0
            ? ""
            : functionService.formatAmount(Number(node.expense))}
        </td>
      );

      return [[...cells.filter(Boolean), incomeCell, expenseCell]];
    }

    // ถ้ามีลูก → ลงลึกต่อ
    let rows: React.ReactNode[][] = [];
    children.forEach((child, index) => {
      const childRows = renderRecursive(child, level + 1, maxLevel);

      // ถ้า index === 0 ใส่ cell ของ node ปัจจุบัน
      if (index === 0) {
        const cell = (
          <td
            className="border px-4 py-2"
            key={`cell-${node.id}-${level}`}
            rowSpan={node.row}
          >
            <div className="flex w-full justify-start">
              <p
                style={{ backgroundColor: node.color }}
                className={`px-5 py-1 rounded-lg ${
                  functionService.isLightColor(node.color)
                    ? "text-black"
                    : "text-white"
                }`}
              >
                {node.name}
              </p>
            </div>
          </td>
        );
        childRows[0].unshift(cell); // เพิ่ม cell นี้เข้าแค่แถวแรก
      }

      rows = [...rows, ...childRows];
    });

    return rows;
  };

  const allRows: React.ReactNode[][] = [];
  updatedData.forEach((mainItem) => {
    const rows = renderRecursive(mainItem, 0, countLevel);
    allRows.push(...rows);
  });

  return (
    <tbody>
      {allRows.map((row, index) => (
        <tr key={`row-${index}`}>{row}</tr>
      ))}
      <tr className="bg-[var(--gray)]/40">
        <td className="border px-4 py-2 text-center" colSpan={countLevel}>
          รวม
        </td>
        <td className="border px-4 py-2 text-end">
          {functionService.formatAmount(total.income)}
        </td>
        <td className="border px-4 py-2 text-end">
          {functionService.formatAmount(total.expense)}
        </td>
      </tr>
    </tbody>
  );
}

function addRowRecursive(data: SummaryNode[], level: number): SummaryNode[] {
  return data.map((item) => {
    const subKey = `sub${level + 1}`;
    if (Array.isArray(item[subKey])) {
      item[subKey] = addRowRecursive(item[subKey], level + 1);
      // รวมค่า row ของลูกทั้งหมด
      const totalRow = item[subKey].reduce((sum: number, child: any) => {
        return sum + (parseInt(child.row) || 1);
      }, 0);
      item.row = totalRow;
    }
    return item;
  });
}
