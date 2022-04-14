import React from 'react';
import styles from 'scss/components/Header.module.scss';
import Link from 'next/link';
import { client, MenuLocationEnum } from 'client';
import { flatListToHierarchical } from 'lib/utils/flatListToHierarchical';

interface Props {
  title?: string;
  description?: string;
}

function Header({
  title = 'Headless by WP Engine',
  description,
}: Props): JSX.Element {
  const { menuItems } = client.useQuery()


  const menuItemsAsFlatList = menuItems({
    where: { 
      location: MenuLocationEnum.PRIMARY
     },
  }).nodes.map(menuItem => ({
      id: menuItem.id,
      label: menuItem.label,
      url: menuItem.url,
      title: menuItem.title,
      databaseId: menuItem.databaseId,
      parentDatabaseId: menuItem.parentDatabaseId,
    }));

    // Convert the query for menu items into a 
    // hierarchical structure.
  const links = flatListToHierarchical( menuItemsAsFlatList, {
    idKey: 'databaseId',
    parentKey: 'parentDatabaseId',
    childrenKey: 'children',
  } );

  return (
    <header>
      <div className={styles.wrap}>
        <div className={styles['title-wrap']}>
          <p className={styles['site-title']}>
            <Link href="/">
              <a>{title}</a>
            </Link>
          </p>
          {description && <p className={styles.description}>{description}</p>}
        </div>
        <div className={styles.menu}>
          <ul>
            {links?.map((link, key) => (
              <li key={`${link.parentDatabaseId}-${link.databaseId}-${key}-menuItem`}>
                <Link href={link.url ?? ''}>
                  <a href={link.url}>{link.label}</a>
                </Link>
                {link.children?.length > 0 && (
                    <ul>
                      {link.children.map((child, key) => {
                        return (
                          <li key={`${link.parentDatabaseId}-${link.databaseId}-${key}-menuItem`}>
                            <Link href={child.url ?? ''}>
                              <a href={child.url}>{child.label}</a>
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
              </li>
            ))}
            <li>
              <Link href="https://github.com/wpengine/faustjs">
                <a
                  className="button"
                  href="https://github.com/wpengine/faustjs">
                  GitHub
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
