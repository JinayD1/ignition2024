"use server"
import { getIronSession } from "iron-session"
import { SessionData, defaultSession, sessionOptions } from "./lib"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import TurndownService from 'turndown'
import { marked } from 'marked'

export const getSession = async () => {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (!session.logged_in) {
        session.logged_in = defaultSession.logged_in;
    }
    return session;
};

export const login = async (email: string, password: string) => {
    const session = await getSession();
    try {
        const response = await fetch('http://192.168.2.66:5000/login', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(res => res.json());

        if (response.error) {
            return { success: false, error: response.error };
        }

        const notesResponse = await fetch('http://192.168.2.66:5000/get_notes', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: response.User })
        }).then(res => res.json());

        if (!notesResponse.error) {
            const notes = notesResponse.map((doc: { id: number | string, name: string }) => ({
                id: doc.id,
                name: doc.name
            }));
            session.noteSessions = notes;
        }

        session.userId = response.User;
        session.email = email;
        session.logged_in = true;
        await session.save();

        return { success: true };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: 'An unexpected error occurred' };
    }
};

export const logout = async () => {
    const session = await getSession();
    session.destroy()
    redirect('/')
}

const turndownService = new TurndownService({
    headingStyle: "atx",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
  });
  
  // Custom rules for different styles

  turndownService.addRule("italic", {
    filter: ["em", "i"],
    replacement: (content) => `_${content}_`,
  });
  
  turndownService.addRule("bold", {
    filter: ["strong", "b"],
    replacement: (content) => `**${content}**`,
  });
  
  turndownService.addRule("underline", {
    filter: (node) => node.nodeName === "U",
    replacement: (content) => `<u>${content}</u>`,
  });
  
  turndownService.addRule("strikethrough", {
    filter: ["s", "del", "strike"],
    replacement: (content) => `~~${content}~~`,
  });
  
  turndownService.addRule("fontSize", {
    filter: (node) => node.nodeName === "SPAN" && node.style.fontSize,
    replacement: (content, node) => {
      const fontSize = node.style.fontSize;
      return `<span style="font-size:${fontSize};">${content}</span>`;
    },
  });
  
  // Convert HTML to Markdown
  export const htmlToMarkdown = (html: string): string => {
    const result = turndownService.turndown(html);
    return result;
  };
  
  // Convert Markdown to HTML
  export const markdownToHtml = (markdown: string): Promise<string> => {
    const result = marked(markdown);
    return result;
  };

export const update_notes = async (id: number, content: string) => {
    console.log('CONTENT-CHECK: ', htmlToMarkdown(content))
    const newContent = await htmlToMarkdown(content)
    const session = await getSession()
    let res = await fetch(`http://192.168.2.66:5000/update_notes/${id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newContent })})
        .then(res => res.json())
        .then(res => {
            if (res.error) {
                console.log(res.error)
            } else {
                console.log(res.message)
                return res.message
            }
        })
        console.log(res)
        return res

}

export const get_a_note = async (id: number) => {
    const session = await getSession();

    try {
        const res = await fetch(`http://192.168.2.66:5000/update_notes/${id}`, {
            method: "GET"
        });
        
        const data = await res.json();

        if (data.error) {
            console.log(data.error);
            return "empty document";
        } else {
            return data.content;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return "empty document";
    }
}

export const chat_bot = async (question: string) => {

    try {
        const res = await fetch(`http://192.168.2.66:5000/chat`, {
            method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: question })
        });
        
        const response = await res.json();

        if (response.error) {
            console.log(response.error);
            return "Request failed";
        } else {
            console.log('response: ', response)
            console.log(response.response);
            return response;
        }
    } catch (error) {
        console.error("Fetch error:", error);
        return "Request failed";
    }
}
