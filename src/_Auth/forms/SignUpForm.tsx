import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SignUpValiation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { userCreteUserAccount, userUseSignInAccount } from "@/lib/react-query/queriesAndMutation";
import { useUserContext } from "@/context/AuthConext";

const SignUpForm = () => {
    const { toast } = useToast();
    const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
    const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = userCreteUserAccount();
    const { mutateAsync: signInAccount, isPending: isSigningIn } = userUseSignInAccount();
    const navigate = useNavigate();

    // 1. Define your form.
    const form = useForm<z.infer<typeof SignUpValiation>>({
        resolver: zodResolver(SignUpValiation),
        defaultValues: {
            name: "",
            username: "",
            email: "",
            password: "",
        },
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof SignUpValiation>) {
        // here we are creating the user
        const newUser = await createUserAccount(values);
        // here we are cheking if usernot created the we are showing error in the form of toast
        if (!newUser) {
            return toast({
                title: "Sign up failed. Please try again.",
            });
        }

        // here we re creating the session 
        const session = await signInAccount({
            email: values.email,
            password: values.password
        })
        // here we are cheking if session not created the we are showing error in the form of toast
        if (!session) {
            return toast({
                title: "Sign up failed. Please try again.",
            });
        }

        const isLoggedIn = await checkAuthUser();
        if (isLoggedIn) {
            form.reset();
            navigate('/');
        } else {
            return toast({
                title: "Sign up failed. Please try again.",
            });
        }

    }

    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col ">
                <img src="/assets/images/logo.svg" alt="logo" />

                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-5">
                    Create a new Account
                </h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">
                    To Use SnapGram Please enter ur details{" "}
                </p>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-5 mt-2"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {isCreatingAccount ? (
                            <div className="flex-center gap-2">
                                <Loader /> Loading...
                            </div>
                        ) : (
                            "Sign Up"
                        )}
                    </Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Already have an account?
                        <Link
                            to="/sign-in"
                            className="text-primary text-small-semibold ml-1"
                        >
                            Log in{" "}
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    );
};

export default SignUpForm;
