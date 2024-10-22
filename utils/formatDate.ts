export function formatDateString(dateString: string): string {
  const [day, month, year] = dateString.split('/').map(Number);

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  return ` ${day} ${months[month - 1]} ${year}`;
}
