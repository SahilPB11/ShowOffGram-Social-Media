import * as z from "zod"


export const SignUpValiation = z.object({
    name: z.string().min(2, {message: "Name must be Greater then 2 characters"}),
    username: z.string().min(2,{message: "user name is too Short "}),
    email: z.string().email(),
    passwor: z.string().min(8, {message: "Password must Be atleast 8 characters"}),
});
