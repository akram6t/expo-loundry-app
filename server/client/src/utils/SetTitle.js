import React, { useEffect } from 'react';

export const SetTitle = (title) => {

    useEffect(() => {
        const subscribe = document.title = `${title} - Admin Panel`;
        return () => subscribe;
      }, []);
}