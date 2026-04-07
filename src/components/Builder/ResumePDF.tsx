'use client';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ResumeState } from '@/lib/features/resume/resumeSlice';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        color: '#333',
    },
    header: {
        marginBottom: 20,
        borderBottom: 2,
        paddingBottom: 10,
    },
    fullName: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    jobTitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    contactInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        fontSize: 9,
        color: '#888',
        gap: 10,
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottom: 1,
        paddingBottom: 2,
        marginBottom: 8,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    itemTitle: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    itemSubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    itemDate: {
        fontSize: 9,
        color: '#666',
    },
    description: {
        fontSize: 9,
        lineHeight: 1.4,
        textAlign: 'justify',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    skillTag: {
        fontSize: 8,
        backgroundColor: '#f0f0f0',
        padding: '3 6',
        borderRadius: 3,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 5,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    pageNumber: {
        position: 'absolute',
        bottom: 20,
        right: 40,
        fontSize: 8,
        color: '#aaa',
    },
});

interface ResumePDFProps {
    readonly data: ResumeState;
}

export const ResumePDF = ({ data }: ResumePDFProps) => {
    const fontSizeMap = {
        small: { body: 8, title: 20, subtitle: 12, section: 10 },
        medium: { body: 9, title: 24, subtitle: 14, section: 12 },
        large: { body: 10, title: 28, subtitle: 16, section: 14 }
    };

    const fs = fontSizeMap[data.fontSize || 'medium'];
    const gap = data.sectionSpacing || 15;
    const color = data.themeColor || '#2563eb';

    const renderSection = (sectionId: string) => {
        switch (sectionId) {
            case 'summary':
                if (!data.personalInfo?.summary) return null;
                return (
                    <View key="summary" style={[styles.section, { marginBottom: gap }]}>
                        <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                            Professional Summary
                        </Text>
                        <Text style={[styles.description, { fontSize: fs.body }]}>
                            {data.personalInfo.summary}
                        </Text>
                    </View>
                );
            case 'experience':
                if (!data.experiences?.length) return null;
                return (
                    <View key="experience" style={[styles.section, { marginBottom: gap }]}>
                        <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                            Work Experience
                        </Text>
                        {data.experiences.map((exp) => (
                            <View key={exp.id} style={{ marginBottom: gap * 0.6 }}>
                                <View style={styles.itemHeader}>
                                    <Text style={[styles.itemTitle, { fontSize: fs.body + 1 }]}>{exp.position}</Text>
                                    <Text style={styles.itemDate}>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</Text>
                                </View>
                                <Text style={[styles.itemSubtitle, { color, fontSize: fs.body }]}>{exp.company}</Text>
                                <Text style={[styles.description, { fontSize: fs.body }]}>{exp.description}</Text>
                            </View>
                        ))}
                    </View>
                );
            case 'education':
                if (!data.education?.length) return null;
                return (
                    <View key="education" style={[styles.section, { marginBottom: gap }]}>
                        <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                            Education
                        </Text>
                        {data.education.map((edu) => (
                            <View key={edu.id} style={{ marginBottom: gap * 0.5 }}>
                                <View style={styles.itemHeader}>
                                    <Text style={[styles.itemTitle, { fontSize: fs.body + 1 }]}>{edu.school}</Text>
                                    <Text style={styles.itemDate}>{edu.startDate} — {edu.endDate}</Text>
                                </View>
                                <Text style={[styles.itemSubtitle, { fontSize: fs.body }]}>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</Text>
                            </View>
                        ))}
                    </View>
                );
            case 'projects':
                if (!data.projects?.length) return null;
                return (
                    <View key="projects" style={[styles.section, { marginBottom: gap }]}>
                        <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                            Key Projects
                        </Text>
                        {data.projects.map((proj) => (
                            <View key={proj.id} style={{ marginBottom: gap * 0.6 }}>
                                <View style={styles.itemHeader}>
                                    <Text style={[styles.itemTitle, { fontSize: fs.body + 1 }]}>{proj.name}</Text>
                                    {proj.link && <Text style={[styles.itemDate, { color: '#2563eb' }]}>{proj.link}</Text>}
                                </View>
                                {proj.technologies && (
                                    <Text style={[styles.itemSubtitle, { color: '#666', fontSize: fs.body - 1, marginBottom: 2 }]}>
                                        {proj.technologies}
                                    </Text>
                                )}
                                <Text style={[styles.description, { fontSize: fs.body }]}>{proj.description}</Text>
                            </View>
                        ))}
                    </View>
                );
            case 'skills':
                if (!data.skills?.length) return null;
                return (
                    <View key="skills" style={[styles.section, { marginBottom: gap }]}>
                        <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                            Skills
                        </Text>
                        <View style={styles.skillsContainer}>
                            {data.skills.map((skill) => (
                                <Text key={skill} style={[styles.skillTag, { fontSize: fs.body - 1 }]}>{skill}</Text>
                            ))}
                        </View>
                    </View>
                );
            case 'languages':
                if (!data.languages?.length) return null;
                return (
                    <View key="languages" style={[styles.section, { marginBottom: gap }]}>
                        <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                            Languages
                        </Text>
                        <View style={styles.skillsContainer}>
                            {data.languages.map((lang) => (
                                <Text key={lang} style={[styles.skillTag, { fontSize: fs.body - 1 }]}>{lang}</Text>
                            ))}
                        </View>
                    </View>
                );
            case 'certifications':
                if (!data.certifications?.length) return null;
                return (
                    <View key="certifications" style={[styles.section, { marginBottom: gap }]}>
                        <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                            Certifications
                        </Text>
                        {data.certifications.map((cert, i) => (
                            <Text key={i} style={[styles.description, { fontSize: fs.body, marginBottom: 3 }]}>• {cert}</Text>
                        ))}
                    </View>
                );
            default:
                if (sectionId.startsWith('custom-')) {
                    const customSec = data.customSections?.find(s => s.id === sectionId);
                    if (!customSec?.content) return null;
                    return (
                        <View key={sectionId} style={[styles.section, { marginBottom: gap }]}>
                            <Text style={[styles.sectionTitle, { color, borderBottomColor: color + '40', fontSize: fs.section }]}>
                                {customSec.title}
                            </Text>
                            <Text style={[styles.description, { fontSize: fs.body }]}>
                                {customSec.content.replace(/<[^>]*>/g, '')} {/* Basic HTML strip for PDF */}
                            </Text>
                        </View>
                    );
                }
                return null;
        }
    };

    const renderedSections = (data.sections || [])
        .filter(s => s.isVisible && s.id !== 'personal')
        .map(s => renderSection(s.id));

    return (
        <Document>
            <Page size="A4" style={[styles.page, { padding: data.margins || 40, lineHeight: data.lineSpacing || 1.4 }]}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: color, marginBottom: gap }]}>
                    <View style={{ width: '80%' }}>
                        <Text style={[styles.fullName, { color, fontSize: fs.title }]}>
                            {data.personalInfo?.fullName || 'Your Name'}
                        </Text>
                        <Text style={[styles.jobTitle, { fontSize: fs.subtitle }]}>
                            {data.personalInfo?.jobTitle || 'Your Professional Title'}
                        </Text>
                        <View style={styles.contactInfo}>
                            {data.personalInfo?.email && <Text>{data.personalInfo.email}</Text>}
                            {data.personalInfo?.phone && <Text>{data.personalInfo.phone}</Text>}
                            {data.personalInfo?.address && <Text>{data.personalInfo.address}</Text>}
                            {data.personalInfo?.website && <Text>{data.personalInfo.website}</Text>}
                        </View>
                    </View>
                    {data.personalInfo?.avatarUrl && (
                        <Image src={data.personalInfo.avatarUrl} style={styles.avatar} />
                    )}
                </View>

                {renderedSections}
                
                <Text 
                    style={styles.pageNumber} 
                    render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
                    fixed 
                />
            </Page>
        </Document>
    );
};
