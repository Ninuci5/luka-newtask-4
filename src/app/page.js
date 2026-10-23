import RegisterForm from "@/components/registerForm/RegisterForm";

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-black">
      <RegisterForm />
    </div>
  );
}
