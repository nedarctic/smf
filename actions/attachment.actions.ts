"use server";

import { prisma } from '@/lib/prisma';

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

        //store the evidence to django

        if (files && files.length > 0) {
            for (const file of Array.from(files)) {
                const uploadForm = new FormData();
                uploadForm.append("file", file);

                const res = await fetch(
                    `${process.env.DJANGO_API_URL}/api/upload/`,
                    {
                        method: "POST",
                        body: uploadForm,
                    }
                );

                console.log("File successfully uploaded to Django:", res);

                if (!res.ok) {
                    throw new Error("File upload failed");
                }

                const data = await res.json();
                console.log("Response JSON:", data);

                // Save reference in Prisma
                await prisma.attachment.create({
                    data: {
                        incidentId,
                        uploadedBy: uploaderType,
                        fileName: file.name,
                        filePath: data.download_url, // ← Django returns file path
                    },
                }).then(res => console.log("File path and name successfully saved to Prisma:", res));
            }
        }
} catch (error) {
        console.log("Error uploading additional evidence")
    }
}