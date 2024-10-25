import React, { useEffect, useRef } from "react";

// Custom hook to run effect only on update
export default function useEffectOnUpdate(effectFunction, deps) {
    // Ref to track first render
    const firstRender = useRef(true);
    
    // useEffect hook to run effect only on update
    useEffect(() => {
        // Check if it's not the first render
        if (firstRender.current) {
            // If it's the first render, set firstRender to false
            firstRender.current = false;
        } else {
            // If it's not the first render, execute the effect function
            effectFunction();
        }
    }, deps); // Dependency array passed to useEffect
}
