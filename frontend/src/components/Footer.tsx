import { UI_CONFIG } from '@/config';

export default function Footer() {
    const { authorInfo, footerCopyright } = UI_CONFIG;
    
    return (
        <footer className="py-8 mt-auto bg-surface border-t border-border">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <p className="text-text-secondary font-medium">{footerCopyright}</p>
                        <p className="text-xs text-text-tertiary mt-1">Все права защищены</p>
                    </div>
                    
                    <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                        <li className="text-text-secondary">
                            <span className="text-text-tertiary mr-1">Автор:</span> {authorInfo.name}
                        </li>
                        <li className="text-text-secondary">
                            <span className="text-text-tertiary mr-1">Группа:</span> {authorInfo.group}
                        </li>
                        <li>
                            <a href={`mailto:${authorInfo.email}`} className="text-primary hover:text-primary-hover transition-colors">
                                {authorInfo.email}
                            </a>
                        </li>
                        <li>
                            <a href={`tel:${authorInfo.phone}`} className="text-primary hover:text-primary-hover transition-colors">
                                {authorInfo.phone}
                            </a>
                        </li>
                </ul>
                </div>
            </div>
        </footer>
    );
}
