import fs from 'fs';
import { join } from 'path';

import matter from 'gray-matter';

function readDocumentationPage(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, text) => {
      if (err) {
        reject(err);
      } else {
        const { data, content } = matter(text);
        resolve({
          metadata: data,
          content,
        });
      }
    });
  });
}

/*
 * Return a list of all documentation pages.
 *
 * Each entry is a dictionary with the keys "metadata" and "content".
 */
export async function getAllPages() {
  return new Promise((resolve, reject) => {
    const docsDirectory = join(process.cwd(), 'public', 'documentation');

    fs.readdir(docsDirectory, async (err, files) => {
      if (err) {
        reject(err);
      }

      const pages = await Promise.all(
        files.map((file) => readDocumentationPage(join(docsDirectory, file))),
      );

      resolve(pages);
    });
  });
}

/*
 * Given the list of pages returned by getAllPages(), return the menu as a
 * list.  Each element is a dictionary with the keys "title" and "slug".
 */
export function getMenu(pages) {
  return pages.map(
    (page) => ({
      title: page.metadata.title,
      slug: page.metadata.slug,
    }),
  );
}
