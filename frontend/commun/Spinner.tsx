import { Oval } from 'react-loader-spinner';
import React from 'react';
// const Spinner = <Oval
//   height={80}
//   width={80}
//   color="#4fa94d"
//   wrapperStyle={{}}
//   wrapperClass=""
//   visible={true}
//   ariaLabel='oval-loading'
//   secondaryColor="#4fa94d"
//   strokeWidth={2}
//   strokeWidthSecondary={2}

// />
export const Spinner = () => {
    return (
        <div className="spinner">
        <Oval />
        </div>
    );
    };
