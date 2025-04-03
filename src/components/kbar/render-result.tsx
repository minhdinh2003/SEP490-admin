
<<<<<<< HEAD
=======
export default function RenderResults() {
  const { results, rootActionId } = useMatches();
>>>>>>> ae46164c3f9f5f35ecd5890e6fff3e5483bb0a6b
  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === 'string' ? (
          <div className='px-4 py-2 text-sm uppercase text-primary-foreground opacity-50'>
            {item}
          </div>
        ) : (
          <ResultItem
            action={item}
            active={active}
            currentRootActionId={rootActionId ?? ''}
          />
        )
      }
    />
  );
}
