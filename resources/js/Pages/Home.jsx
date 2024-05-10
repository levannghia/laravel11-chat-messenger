import Authenticated from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { Head } from '@inertiajs/react';

function Home({ auth }) {
    return (
        <>
        <Head title="Home" />
        </>
    );
}

Home.layout = (page) => {
    return (
        <Authenticated>
            <ChatLayout children={page}/>
        </Authenticated>
    )
}

export default Home
