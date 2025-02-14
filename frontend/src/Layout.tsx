import { Outlet } from "react-router-dom";
import Navigation from "./components/Navbar/Navigation";

const Layout = () => {
    return (
        <>
            <Navigation />
            <section
                id="home"
                className="h-screen w-screen bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: "url('/expense-img.jpg')" }}
            >
                <Outlet />
            </section>
        </>
    );
};

export default Layout;