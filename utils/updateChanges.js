export default async function updateChanges(listID, change, user) {
  const contentType = "application/json";

  try {
    const res = await fetch(
      `${process.env.BASE_URL}/api/lists/changes/${listID}`,
      {
        method: "PUT",
        headers: {
          Accept: contentType,
          "Content-Type": contentType,
        },
        body: user
          ? JSON.stringify({ ...change, user })
          : JSON.stringify(change),
      }
    );

    if (!res.ok) {
      throw new Error(res.status);
    }
  } catch (error) {
    console.error(error);
  }
}
