import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import CatalogClient from '@/components/CatalogClient';

function getAwardees() {
  const filePath = path.join(process.cwd(), 'src', 'data', 'daftar_awardee.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return Papa.parse(fileContent, { header: true }).data.filter(a => a['Nama Awardee']);
}

export default function Home() {
  const awardees = getAwardees();
  return <CatalogClient awardees={awardees} />;
}
