import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      referal,
      namaAwardee,
      wilayah,
      namaEvaluator,
      kotaEvaluator,
      hubungan,
      lamaKenal,
      scores,
      saranDiri,
      saranProgram
    } = body;

    // Autentikasi Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
      ],
    });

    const sheets = google.sheets({ auth, version: 'v4' });
    
    // Baris yang akan di-append
    const row = [
      new Date().toISOString(),
      referal,
      namaAwardee,
      wilayah,
      namaEvaluator,
      kotaEvaluator,
      hubungan,
      lamaKenal,
      ...(scores || []),
      saranDiri || '',
      saranProgram || ''
    ];

    const spreadsheetId = process.env.SPREADSHEET_ID;

    // Append ke Sheet pertama (Sheet1)
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting to Google Sheets:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
