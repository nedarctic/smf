import { LoginForm } from "@/components/login-form";

export default function HandlerLoginPage () {
    return (
        <div className="flex flex-col min-h-screen w-full
        items-center justify-center gap-6">
            <p className="text-lg font-bold">SemaFacts Handler Login</p>
            <div className="w-full lg:w-1/3">
            <LoginForm userType={"Handler"}/>
            </div>
        </div>
    );
}