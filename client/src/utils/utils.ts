export const formatDate = (daysToAdd: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
  
    const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  
    const day = dayNames[date.getDay()];
    const month = monthNames[date.getMonth()];
    const dateNum = date.getDate();
  
    const suffix = dateNum === 1 || dateNum === 21 || dateNum === 31 ? "ST" :
                   dateNum === 2 || dateNum === 22 ? "ND" :
                   dateNum === 3 || dateNum === 23 ? "RD" : "TH";
  
    return `${day} ${dateNum}${suffix} ${month} ${date.getFullYear()}`;
  };
