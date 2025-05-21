// import CustomText from '@components/Ui/CustomText';
// import React, { useEffect, useState } from 'react';
// import { Text, View } from 'react-native';

// type CountdownTimerProps = {
//     backendTime: number;
// };

// const CountdownTimer: React.FC<CountdownTimerProps> = ({ backendTime }) => {
//     const [timeLeft, setTimeLeft] = useState<number>(7200); // 2 hours in seconds

//     useEffect(() => {
//         if (!backendTime) return;

//         const interval = setInterval(() => {
//             setTimeLeft((prev) => {
//                 if (prev <= 0) {
//                     clearInterval(interval);
//                     return 0;
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(interval);
//     }, [backendTime]);

//     const formatTime = (seconds: number): string => {
//         const hours = Math.floor(seconds / 3600);
//         const minutes = Math.floor((seconds % 3600) / 60);
//         const secs = seconds % 60;
//         return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     return (
//         <View>
// <CustomText isBold={true} style={{ textAlign: 'left', fontSize: 16, color: '#ED1C24', letterSpacing:0.5}}>
//     {formatTime(timeLeft)}
// </CustomText>
//             {/* 
//                 <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#ED1C24' }}>
//                     {formatTime(timeLeft)}
//                 </Text> 
//             */}
//         </View>
//     );
// };

// export default CountdownTimer;

// import CustomText from '@components/Ui/CustomText';
// import React, { useEffect, useState } from 'react';
// import { Text, View } from 'react-native';

// type CountdownTimerProps = {
//     backendTime: string; // ISO timestamp
// };

// const CountdownTimer: React.FC<CountdownTimerProps> = ({ backendTime }) => {
//     const [timeLeft, setTimeLeft] = useState<number>(0);

//     // console.log("BackEnd Time : ", backendTime);


//     useEffect(() => {
//         if (!backendTime) return;

//         // Convert backend time from UTC to Pakistan Time (UTC+5)
//         const backendDate = new Date(backendTime);
//         const backendTimestamp = backendDate.getTime() + 5 * 3600 * 1000; // Adjust to PKT
//         const targetTime = backendTimestamp + 2 * 3600 * 1000; // 2 hours after backend time (PKT)

//         const updateTimer = () => {
//             const currentTime = Date.now() + 5 * 3600 * 1000; // Adjust current time to PKT
//             const remainingTime = Math.max(0, Math.floor((targetTime - currentTime) / 1000));
//             setTimeLeft(remainingTime);
//         };

//         updateTimer(); // Initial call
//         const interval = setInterval(updateTimer, 1000);

//         return () => clearInterval(interval);
//     }, [backendTime]);

//     const formatTime = (seconds: number): string => {
//         const hours = Math.floor(seconds / 3600);
//         const minutes = Math.floor((seconds % 3600) / 60);
//         const secs = seconds % 60;
//         return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//     };

//     return (
//         <View>
//             <CustomText isBold={true} style={{ textAlign: 'left', fontSize: 16, color: '#ED1C24', letterSpacing: 0.5 }}>
//                 {formatTime(timeLeft)}
//             </CustomText>
//         </View>
//     );
// };

// export default CountdownTimer;

import CustomText from '@components/Ui/CustomText';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

type CountdownTimerProps = {
    backendTime: string; // ISO timestamp
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ backendTime }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        if (!backendTime) return;

        // Convert backend time from UTC to Pakistan Time (UTC+5)
        const backendDate = new Date(backendTime);
        const backendTimestamp = backendDate.getTime() + 5 * 3600 * 1000; // Adjust to PKT
        const targetTime = backendTimestamp + 2 * 3600 * 1000; // 2 hours after backend time (PKT)

        const updateTimer = () => {
            const currentTime = Date.now() + 5 * 3600 * 1000; // Adjust current time to PKT
            const remainingTime = Math.floor((targetTime - currentTime) / 1000); // Removed Math.max(0, ...)
            setTimeLeft(remainingTime);
        };

        updateTimer(); // Initial call
        const interval = setInterval(updateTimer, 1000);

        return () => clearInterval(interval);
    }, [backendTime]);

    const formatTime = (seconds: number): string => {
        const isNegative = seconds < 0;
        const absSeconds = Math.abs(seconds);
        const hours = Math.floor(absSeconds / 3600);
        const minutes = Math.floor((absSeconds % 3600) / 60);
        const secs = absSeconds % 60;
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        return isNegative ? `-${timeString}` : timeString;
    };

    return (
        <View>
            <CustomText isBold={true} style={{ textAlign: 'left', fontSize: 16, color: '#ED1C24', letterSpacing: 0.5 }}>
                {formatTime(timeLeft)}
            </CustomText>
        </View>
    );
};

export default CountdownTimer;