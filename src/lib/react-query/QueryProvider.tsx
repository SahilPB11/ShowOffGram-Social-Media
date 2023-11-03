import { QueryClient, QueryClientProvider } from 'node_modules/@tanstack/react-query/build/legacy'
import { ReactNode } from 'react'

const queryClient = new QueryClient();
export const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
};

export default QueryProvider;