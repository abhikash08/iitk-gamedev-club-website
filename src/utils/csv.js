import Papa from 'papaparse';

const BASE_URL = import.meta.env.BASE_URL;

export const parseCsvText = (csvText) => {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
  });

  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }

  return result.data.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key, typeof value === 'string' ? value.trim() : value]),
    ),
  );
};

export const fetchCsv = async (path) => {
  const fullPath = path.startsWith('/') ? `${BASE_URL}${path.slice(1)}` : `${BASE_URL}${path}`;
  const response = await fetch(fullPath);
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${fullPath}`);
  }
  const csvText = await response.text();
  return parseCsvText(csvText);
};