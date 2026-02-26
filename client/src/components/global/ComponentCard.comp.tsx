// Componente card
function ComponentCard({
    name,
    desc,
    img: Img,
}: {
    name: string;
    desc: string;
    img?: string;
}) {
    return (
        <div className="flex flex-col items-center rounded-3xl bg-primary-bg border-[2px] border-primary-text py-4 px-2.5 w-[85%] max-w-[400px] justify-center">
            {Img && <img src={Img} alt={name} />}
            <div className="flex flex-col items-center justify-center">
                <h3 className="text-primary-text text-medium font-semibold center">
                    {name}
                </h3>
                <p className="text-primary-text text-small text-center leading-5">
                    {desc}
                </p>
            </div>
        </div>
    );
}

// Esportazione componente
export default ComponentCard;
