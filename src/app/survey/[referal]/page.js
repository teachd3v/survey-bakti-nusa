import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import SurveyForm from '@/components/SurveyForm';
import { notFound } from 'next/navigation';

function getCsvData(filename) {
  const filePath = path.join(process.cwd(), 'src', 'data', filename);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return Papa.parse(fileContent, { header: true }).data;
}

export default async function SurveyPage({ params }) {
  const { referal } = await params;
  
  // Ambil data awardees
  const awardees = getCsvData('daftar_awardee.csv');
  const awardee = awardees.find(a => a.Referal === referal);

  if (!awardee || !awardee['Nama Awardee']) {
    return notFound();
  }

  // Ambil rubrik
  const rubrics = getCsvData('rubrik_evaluasi.csv').filter(r => r['Indikator Penilaian']);

  return <SurveyForm awardee={awardee} rubrics={rubrics} />;
}
