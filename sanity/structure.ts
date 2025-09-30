// no type import needed, avoids circular alias errors
export const customStructure = (S: any) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('post').title('Posts'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('author').title('Authors'),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item: any) =>
          item.getId() &&
          !['post', 'category', 'author'].includes(item.getId()!),
      ),
    ])