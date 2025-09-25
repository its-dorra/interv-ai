export default async function JobInfoPage({
  params,
}: PageProps<"/app/job-infos/[id]">) {
  const { id } = await params;

  return id;
}
