import { Button, defineDashboardExtension, Page, PageBlock, PageLayout, PageTitle } from '@vendure/dashboard';
import { useState } from 'react';

defineDashboardExtension({
    routes: [
        {
            path: '/example',
            loader: () => ({ breadcrumb: 'Example Route' }),
            navMenuItem: {
                id: 'example',
                title: 'Example Route',
                sectionId: 'catalog',
            },
            component: () => {
                const [count, setCount] = useState(0);
                return (
                    <Page pageId="example-page">
                        <PageTitle>Example Route</PageTitle>
                        <PageLayout>
                            <PageBlock column="main" blockId="greeting">
                                <h2>Hello!</h2>
                                <p className="text-muted-foreground mb-4">
                                    Your Dashboard extension is working!
                                </p>
                                <Button variant="secondary" onClick={() => setCount(c => c + 1)}>
                                    Clicked {count} times
                                </Button>
                            </PageBlock>
                        </PageLayout>
                    </Page>
                );
            },
        },
    ],
    pageBlocks: [],
    actionBarItems: [],
    widgets: [],
    customFormComponents: {},
});
