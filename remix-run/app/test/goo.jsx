import { useLoaderData } from "remix";

export let loader = async ( props ) => {
    console.log("loader", props );
    const { params } = props;
    return params
}

export default function Goo() {

    const params = useLoaderData();
    const { uri } = params;

    return (
        <div>
            <h1>Goo.jsx {uri}</h1>
            <pre>{JSON.stringify(params, null, 2 )}</pre>
        </div>
    );
}
