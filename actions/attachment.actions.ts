"use server";

import { prisma } from '@/lib/prisma';
import { getAccessToken } from '@/lib/auth';

export async function uploadAdditionalEvidence({
    files,
    incidentId,
    uploaderType,
}: {
    files: FileList,
    incidentId: string,
    uploaderType: "Handler" | "Reporter",
}
) {
    try {

        const token = await getAccessToken();

        if (files && files.length > 0) {
            for (const file of Array.from(files)) {
                const uploadForm = new FormData();
                uploadForm.append("file", file);

                const res = await fetch(
                    `${process.env.DJANGO_API_URL}/api/upload/`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        body: uploadForm,
                    }
                );

                if (!res.ok) {
                    throw new Error("File upload failed");
                }

                const data = await res.json();
                
                
                await prisma.attachment.create({
                    data: {
                        incidentId,
                        uploadedBy: uploaderType,
                        fileName: file.name,
                        filePath: data.download_url,
                    },
                })
            }
        }
    } catch (error) {
        console.log("Error uploading additional evidence")
    }
}