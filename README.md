# วิธีการใช้งาน

## 1. Clone โปรเจกต์จาก GitHub
```bash
git clone https://github.com/sang-sung/next-js-income-expense.git
```

## 2. ติดตั้งแพ็กเกจที่จำเป็น
```bash
cd next-js-income-expense
npm install
```

## 3. เพิ่มไฟล์ .env ในโปรเจกต์
สร้างไฟล์ .env โดยคัดลอกจาก .env.example แล้วแก้ไขค่าต่าง ๆ ให้ถูกต้อง

## 4. สร้าง Database และ Migration
รันคำสั่ง
```bash
npm run prisma:migrate
```

## 5. รัน server
```bash
npm run dev
```

## 6. เข้าสู่ระบบผู้ดูแลระบบ
เปิดเบราว์เซอร์แล้วเข้าไปที่:
http://localhost:3000/admin/login
- Username: admin
- Password: (ไม่ต้องกรอกอะไร)

## 7. เพิ่มผู้ใช้งานใหม่
หลังจากเข้าสู่ระบบสำเร็จ ให้ไปที่เมนู Admin
เพิ่มผู้ใช้ใหม่โดยกำหนด user และ password ที่ต้องการ

## 8. ลบผู้ใช้งาน admin ออก
เพื่อความปลอดภัยของระบบ แนะนำให้ลบผู้ใช้งาน admin ออกหลังจากเพิ่มผู้ใช้งานจริงเรียบร้อยแล้ว