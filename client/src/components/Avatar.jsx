export default function Avatar({
  src,
  name = '?',
  size = 40
}) {

  const isCozy =
    localStorage.getItem('colorTheme') === 'cozy';

  if (src) {

    return (
      <img
        src={src}
        alt={name}
        style={{
          width: size,
          height: size
        }}
        className="rounded-full object-cover ring-2 ring-white"
      />
    );

  }

  const initial =
    (name || '?')[0].toUpperCase();

  return (

    <div
      style={{
        width: size,
        height: size
      }}
      className={`rounded-full text-white grid place-items-center font-bold ring-2 ring-white ${
        isCozy
          ? 'bg-gradient-to-br from-[#8EB6D9] to-[#6F8FB8]'
          : 'bg-brand-gradient'
      }`}
    >
      {initial}
    </div>

  );

}