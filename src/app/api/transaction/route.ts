import { getUserFromToken } from "@/services/api/getUserFromToken";
import { returnErr } from "@/services/api/errorHandler";
import { transactionsService } from "@/services/api/transactions.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const user_id = getUserFromToken(req).userId;

    const result = await transactionsService.getAll(user_id);
    const { status, ...bodyData } = result;

    return NextResponse.json(bodyData, { status });
  } catch (err) {
    return returnErr(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user_id = getUserFromToken(req).userId;
    const body = await req.json();

    const result = await transactionsService.create(user_id, body);
    const { status, ...bodyData } = result;

    return NextResponse.json(bodyData, { status });
  } catch (err) {
    return returnErr(err);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const result = await transactionsService.update(body.id, body);
    const { status, ...bodyData } = result;

    return NextResponse.json(bodyData, { status });
  } catch (err) {
    return returnErr(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json({
        success: false,
        message: "ไม่พบ ID ที่ต้องการลบ",
      });
    }
    const result = await transactionsService.delete(body.id);
    const { status, ...bodyData } = result;

    return NextResponse.json(bodyData, { status });
  } catch (err) {
    return returnErr(err);
  }
}

// import db from "@/lib/db";
// import { returnErr } from "@/services/api/errorHandler";
// import { getUserFromToken } from "@/services/api/getUserFromToken";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest) {
//   const user_id = getUserFromToken(req).userId;

//   const [rows] = (await db.execute(
//     "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC LIMIT 100",
//     [user_id]
//   )) as unknown as [any[]];

//   const dataWithLocalTime = rows.map((row) => {
//     const localDate = new Date(row.date).toLocaleString("en-TH", {
//       timeZone: "Asia/Bangkok",
//     });

//     return {
//       ...row,
//       date: localDate,
//     };
//   });

//   return NextResponse.json({ success: true, data: rows });
// }

// export async function POST(req: NextRequest) {
//   try {
//     const user_id = getUserFromToken(req).userId;
//     const body = await req.json();
//     const { date, desc, amount, type, cate } = body;

//     const created_at = new Date(); // timestamp ปัจจุบัน

//     const [result]: any = await db.execute(
//       `INSERT INTO transactions (user_id, \`date\`, \`desc\`, amount, type, cate, created_at)
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [user_id, date, desc, amount, type, cate, created_at]
//     );

//     return NextResponse.json({
//       success: !!result,
//       message: result ? "เพิ่มรายการสำเร็จ" : "ไม่สามารถเพิ่มรายการได้",
//     });
//   } catch (err) {
//     return returnErr(err);
//   }
// }

// export async function PUT(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { id, date, desc, amount, type, cate } = body;

//     const [result]: any = await db.execute(
//       `UPDATE transactions
//         SET
//           \`date\` = ? ,
//           \`desc\` = ? ,
//           amount = ?,
//           type = ?,
//           cate = ?
//         WHERE id = ?`,
//       [date, desc, amount, type, cate, id]
//     );

//     return NextResponse.json({
//       success: !!result,
//       message: result ? "อัพเดทรายการสำเร็จ" : "ไม่สามารถอัพเดทรายการได้",
//     });
//   } catch (err) {
//     return returnErr(err);
//   }
// }

// export async function DELETE(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const { id } = body;

//     if (!id) {
//       return NextResponse.json({
//         success: false,
//         message: "ไม่พบ ID ที่ต้องการลบ",
//       });
//     }

//     const [result]: any = await db.execute(
//       "DELETE FROM transactions WHERE id = ?",
//       [id]
//     );

//     if (result.affectedRows > 0) {
//       return NextResponse.json({
//         success: true,
//         message: "ลบข้อมูลสำเร็จ",
//       });
//     } else {
//       return NextResponse.json({
//         success: false,
//         message: "ไม่พบข้อมูลที่ต้องการลบ",
//       });
//     }
//   } catch (err) {
//     return returnErr(err);
//   }
// }
