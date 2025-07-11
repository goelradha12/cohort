import React from "react";
import { useNavigate } from "react-router";

const PageNotFound = () => {
    const navigation = useNavigate();
    return (
        <div className="h-screen w-screen flex items-center">
            <div className="container flex flex-col md:flex-row items-center justify-center mx-auto">
                <div className="max-w-md text-center grid gap-2">
                    <div className="text-5xl font-bold">404</div>
                    <p className="text-2xl md:text-3xl font-light leading-normal">
                        Sorry we couldn't find this page.{" "}
                    </p>
                    <p className="mb-8">
                        But dont worry, you can find plenty of other things on our homepage.
                    </p>
                    <button onClick={()=> navigation("/")} className="btn text-lg btn-primary">
                        Back to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PageNotFound;
