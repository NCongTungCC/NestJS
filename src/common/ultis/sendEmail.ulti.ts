import * as nodemailer from 'nodemailer';

export interface OverdueBookData {
  to: string;
  userName: string;
  books: { title: string; dueDate: Date }[];
}

export const sendOverdueBooksEmail = async ({
  to,
  userName,
  books,
}: OverdueBookData) => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
  const bookListHtml = books
    .map(
      (book, idx) =>
        `<li><strong>${idx + 1}. ${
          book.title
        }</strong> – quá hạn từ <em>${book.dueDate.toLocaleDateString()}</em></li>`,
    )
    .join('');

  const htmlContent = `
    <p>Xin chào <strong>${userName}</strong>,</p>
    <p>Các sách dưới đây bạn đã mượn hiện đang <span style="color:red;">quá hạn</span>:</p>
    <ul>${bookListHtml}</ul>
    <p>Vui lòng trả sách sớm nhất có thể. Xin cảm ơn!</p>
  `;

  await transporter.sendMail({
    from: `"ADMIN" <${process.env.EMAIL_USER}>`,
    to,
    subject: '📚 Sách quá hạn - Hệ thống quản lý thư viện',
    html: htmlContent,
  });
};
