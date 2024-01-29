// import {
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
// } from '@mui/material';
// import dayjs from 'dayjs';
// import React from 'react';

// export default function SimpleTable({ data, ticker }) {
//   const propertiesToShow = [
//     'revenue',
//     'costOfRevenue',
//     'grossProfit',
//     'netIncome',
//     'totalAssets',
//     'totalLiabilities',
//   ];
//   if (!data) return null;

//   return (
//     <TableContainer component={Paper}>
//       <Table sx={{ minWidth: 650 }} aria-label="simple table">
//         <TableHead>
//           <TableRow>
//             <TableCell></TableCell>
//             {data.map(i => (
//               <TableCell key={i.date}>{dayjs(i.date).year()}</TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {propertiesToShow.map(property => (
//             <React.Fragment key={property}>
//               <TableRow key={property}>
//                 <TableCell>{property}</TableCell>
//                 {data.map((i: any) => (
//                   <React.Fragment key={i}>
//                     <TableCell sx={{ whiteSpace: 'nowrap' }}>
//                       {i[property]}
//                     </TableCell>
//                   </React.Fragment>
//                 ))}
//               </TableRow>
//             </React.Fragment>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }
