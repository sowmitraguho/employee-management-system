import { useEffect } from "react";
import { useLocation } from "react-router";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth", // optional, can use "auto" for instant scroll
        });
    }, [pathname]);

    return null; // this component doesn’t render anything
}
